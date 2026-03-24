import { useState } from 'react';

interface PaymentData {
  amount: number;
  memo: string;
  metadata: {
    productId?: string;
    orderId?: string;
    [key: string]: any;
  };
}

interface PaymentResult {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: any;
  from_address: string;
  to_address: string;
  direction: string;
  network: string;
  verified: boolean;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
}

export function usePiPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'authenticating' | 'pending' | 'approving' | 'completing' | 'done' | 'cancelled' | 'error'
  >('idle');

  // Tamamlanmamis odeme bulunursa
  const onIncompletePaymentFound = async (payment: PaymentResult) => {
    try {
      await fetch('/api/pi/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: payment.identifier,
          txid: payment.identifier,
        }),
      });
    } catch (err) {
      // Sessizce devam et
    }
  };

  const initializePayment = async (paymentData: PaymentData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setPaymentStatus('authenticating');

    try {
      if (typeof window === 'undefined' || !(window as any).Pi) {
        throw new Error('Pi Browser gerekli. Lutfen Pi Browser ile acan.');
      }

      const Pi = (window as any).Pi;

      // Pi kullanici dogrulamasi
      const authResult = await Pi.authenticate(
        ['username', 'payments'],
        onIncompletePaymentFound
      );

      if (!authResult || !authResult.accessToken) {
        throw new Error('Pi kimlik dogrulamasi basarisiz');
      }

      setPaymentStatus('pending');

      // Odeme olustur
      await new Promise<void>((resolve, reject) => {
        Pi.createPayment(
          {
            amount: paymentData.amount,
            memo: paymentData.memo,
            metadata: paymentData.metadata,
          },
          {
            // Adim 1: Sunucu onayı
            onReadyForServerApproval: async (paymentId: string) => {
              setPaymentStatus('approving');
              try {
                const res = await fetch('/api/pi/approve', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ paymentId }),
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.error || 'Onay basarisiz');
              } catch (err: any) {
                reject(err);
              }
            },

            // Adim 2: Blockchain dogrulamasi sonrasi tamamlama
            onReadyForServerCompletion: async (paymentId: string, txid: string) => {
              setPaymentStatus('completing');
              try {
                const res = await fetch('/api/pi/complete', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ paymentId, txid }),
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.error || 'Tamamlama basarisiz');
                setPaymentStatus('done');
                resolve();
              } catch (err: any) {
                reject(err);
              }
            },

            onCancel: (_paymentId: string) => {
              setPaymentStatus('cancelled');
              setError('Odeme iptal edildi');
              resolve();
            },

            onError: (err: Error) => {
              setPaymentStatus('error');
              reject(err);
            },
          }
        );
      });

      setIsLoading(false);
      return paymentStatus === 'done';

    } catch (err: any) {
      setError(err.message || 'Odeme baslatılamadı');
      setPaymentStatus('error');
      setIsLoading(false);
      return false;
    }
  };

  return {
    initializePayment,
    isLoading,
    error,
    paymentStatus,
  };
}
