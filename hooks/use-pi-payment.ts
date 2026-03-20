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

  const initializePayment = async (paymentData: PaymentData): Promise<PaymentResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Pi Network SDK kontrolü
      if (typeof window === 'undefined' || !(window as any).Pi) {
        throw new Error('Pi Network SDK yüklenmedi');
      }

      const Pi = (window as any).Pi;

      // Kullanıcı kimlik doğrulama
      await Pi.init({ 
        version: "2.0",
        sandbox: true // Geliştirme ortamı için
      });

      const scopes = ['payments'];
      const authResult = await Pi.authenticate(scopes, onIncompletePaymentFound);

      if (!authResult || !authResult.accessToken) {
        throw new Error('Kimlik doğrulama başarısız');
      }

      // Ödeme oluştur
      const payment = await Pi.createPayment({
        amount: paymentData.amount,
        memo: paymentData.memo,
        metadata: paymentData.metadata,
      }, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log('[v0] Ödeme sunucu onayı için hazır:', paymentId);
          // Buradan backend'e istek gönderilecek
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log('[v0] Ödeme tamamlanma için hazır:', paymentId, txid);
          // Buradan backend'e tamamlama isteği gönderilecek
        },
        onCancel: (paymentId: string) => {
          console.log('[v0] Ödeme iptal edildi:', paymentId);
          setError('Ödeme iptal edildi');
        },
        onError: (error: Error, payment?: any) => {
          console.error('[v0] Ödeme hatası:', error);
          setError(error.message);
        },
      });

      setIsLoading(false);
      return payment;

    } catch (err: any) {
      console.error('[v0] Pi ödeme hatası:', err);
      setError(err.message || 'Ödeme başlatılamadı');
      setIsLoading(false);
      return null;
    }
  };

  const onIncompletePaymentFound = (payment: PaymentResult) => {
    console.log('[v0] Tamamlanmamış ödeme bulundu:', payment);
    // Tamamlanmamış ödeme işleme devam et
    return payment.identifier;
  };

  return {
    initializePayment,
    isLoading,
    error,
  };
}
