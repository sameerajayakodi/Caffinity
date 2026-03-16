import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/helpers';
import { CheckCircle, CreditCard, ShieldCheck, Lock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById, markOrderPaid, addToast, customers } = useStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const order = getOrderById(orderId || '');
  const customer = order?.customerId ? customers.find(c => c.id === order.customerId) : null;

  if (!order) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="font-display text-xl font-bold text-espresso mb-2">Order Not Found</h2>
          <p className="text-warm-gray mb-6">This order doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-2xl bg-espresso text-cream font-semibold hover:bg-espresso-light transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      markOrderPaid(order.id);
      addToast('Payment successful! 🎉', 'success');
    }, 2000);
  };

  const alreadyPaid = order.paymentStatus === 'paid' || isSuccess;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-cream to-latte/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-espresso to-espresso-light px-6 py-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-6 text-4xl">☕</div>
            <div className="absolute bottom-2 left-8 text-3xl">💳</div>
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              {alreadyPaid ? (
                <CheckCircle className="w-9 h-9 text-cream" />
              ) : (
                <CreditCard className="w-9 h-9 text-cream" />
              )}
            </div>
            <h1 className="font-display text-2xl font-bold text-cream">
              {alreadyPaid ? 'Payment Complete!' : 'Complete Payment'}
            </h1>
            <p className="text-gold-light text-sm mt-1">Order {order.id}</p>
          </div>
        </div>

        <div className="px-6 py-6">
          {alreadyPaid ? (
            /* Success State */
            <div className="text-center">
              <div className="w-24 h-24 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-14 h-14 text-olive" />
              </div>
              <h2 className="font-display text-xl font-bold text-espresso mb-1">Payment Successful!</h2>
              <p className="text-warm-gray">Please collect your order when ready.</p>

              <div className="bg-cream rounded-2xl p-4 mt-6 space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-espresso">{item.quantity}× {item.product.name}</span>
                    <span className="font-medium text-espresso">{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="h-px bg-latte/50 my-2" />
                <div className="flex justify-between font-bold">
                  <span className="text-espresso">Total Paid</span>
                  <span className="text-olive text-lg">{formatCurrency(order.total)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-6 text-olive text-sm font-medium">
                <ShieldCheck className="w-4 h-4" />
                Transaction verified
              </div>

              <button
                onClick={() => navigate('/')}
                className="w-full mt-4 py-3 rounded-2xl bg-espresso text-cream font-semibold hover:bg-espresso-light transition-colors"
              >
                Return to Home
              </button>
            </div>
          ) : (
            /* Payment Form */
            <>
              {/* Order Summary */}
              <div className="bg-cream rounded-2xl p-4 mb-6">
                <h3 className="font-semibold text-sm text-espresso mb-3 uppercase tracking-wider">Order Summary</h3>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-espresso-light">{item.quantity}× {item.product.name}</span>
                      <span className="font-medium text-espresso">{formatCurrency(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-latte my-3" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-espresso">Total</span>
                  <span className="text-2xl font-bold text-olive">{formatCurrency(order.total)}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center mb-6">
                <div className="bg-cream rounded-2xl p-4 inline-block">
                  <QRCodeSVG
                    value={`caffinity-payment:${order.id}:${order.total}`}
                    size={140}
                    fgColor="#3E2723"
                    bgColor="#FFF8F0"
                  />
                </div>
                <p className="text-xs text-warm-gray mt-2">Scan to pay with your mobile wallet</p>
              </div>

              {/* Pay Button */}
              {customer && customer.savedPaymentMethod && (
                <div className="mb-4 text-center">
                  <div className="bg-latte/10 rounded-2xl p-4 flex items-center justify-between mb-3 border border-latte/30">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-espresso" />
                      <div className="text-left">
                        <p className="text-sm font-bold text-espresso">{customer.name}</p>
                        <p className="text-xs text-warm-gray">
                          {customer.savedPaymentMethod.brand.toUpperCase()} ending in {customer.savedPaymentMethod.last4}
                        </p>
                      </div>
                    </div>
                    <div className="bg-olive/10 text-olive text-xs font-bold px-2 py-1 rounded-md">
                      Saved
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-2xl bg-espresso text-cream font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                  >
                    Pay Automatically
                  </button>
                  <div className="my-4 flex items-center gap-2">
                    <div className="flex-1 h-px bg-latte/50" />
                    <span className="text-xs text-warm-gray font-medium uppercase tracking-wider">OR</span>
                    <div className="flex-1 h-px bg-latte/50" />
                  </div>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2
                  ${isProcessing
                    ? 'bg-warm-gray text-white cursor-wait'
                    : 'bg-gradient-to-r from-olive to-olive-light text-white hover:shadow-xl'
                  }`}
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  `Pay ${formatCurrency(order.total)}`
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-warm-gray text-xs">
                <Lock className="w-3.5 h-3.5" />
                Secure simulated payment
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
