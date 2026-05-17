import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Select, LoadingSpinner, Modal } from '../components/ui';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getCartSummary, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { showSuccess, showError } = useAppStore();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [loading, setLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);

  const [shippingData, setShippingData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [paymentData, setPaymentData] = useState({
    paymentProvider: 'flutterwave',
    currency: 'USD',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const [errors, setErrors] = useState({});
  const summary = getCartSummary();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate('/products')}>
            Back to Shopping
          </Button>
        </div>
      </div>
    );
  }

  const validateShipping = () => {
    const newErrors = {};
    if (!shippingData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingData.email.trim()) newErrors.email = 'Email is required';
    if (!shippingData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!shippingData.address.trim()) newErrors.address = 'Address is required';
    if (!shippingData.city.trim()) newErrors.city = 'City is required';
    if (!shippingData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    if (!paymentData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    if (!paymentData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    if (!paymentData.cvv.trim()) newErrors.cvv = 'CVV is required';
    if (!paymentData.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePayment = async () => {
    if (!validatePayment()) {
      return;
    }

    setLoading(true);
    try {
      // Initialize payment with selected provider
      const paymentResponse = await paymentService.initializePayment({
        amount: summary.totalAmount,
        currency: paymentData.currency,
        paymentProvider: paymentData.paymentProvider,
        cardNumber: paymentData.cardNumber,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        cardholderName: paymentData.cardholderName,
      });

      if (paymentResponse.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = paymentResponse.paymentUrl;
      } else {
        // Process payment directly
        const order = await orderService.createOrder({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: shippingData,
          paymentReference: paymentResponse.reference,
        });

        showSuccess('Order placed successfully!');
        clearCart();
        navigate(`/orders/${order.id}`);
      }
    } catch (error) {
      showError(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
    }
  };

  const handleReview = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      setStep(3);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Processing your order..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-between max-w-2xl">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s <= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    s < step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={shippingData.firstName}
                      onChange={handleShippingChange}
                      error={errors.firstName}
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={shippingData.lastName}
                      onChange={handleShippingChange}
                      error={errors.lastName}
                    />
                  </div>

                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={shippingData.email}
                    onChange={handleShippingChange}
                    error={errors.email}
                  />

                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={shippingData.phone}
                    onChange={handleShippingChange}
                    error={errors.phone}
                  />

                  <Input
                    label="Address"
                    name="address"
                    value={shippingData.address}
                    onChange={handleShippingChange}
                    error={errors.address}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      name="city"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                      error={errors.city}
                    />
                    <Input
                      label="State/Province"
                      name="state"
                      value={shippingData.state}
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Zip Code"
                      name="zipCode"
                      value={shippingData.zipCode}
                      onChange={handleShippingChange}
                    />
                    <Input
                      label="Country"
                      name="country"
                      value={shippingData.country}
                      onChange={handleShippingChange}
                      error={errors.country}
                    />
                  </div>

                  <Button fullWidth type="submit" className="mt-6">
                    Continue to Payment
                  </Button>
                </form>
              </Card>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
                <form onSubmit={handleReview} className="space-y-4">
                  <Select
                    label="Payment Provider"
                    name="paymentProvider"
                    value={paymentData.paymentProvider}
                    onChange={handlePaymentChange}
                    options={[
                      { value: 'flutterwave', label: 'Flutterwave' },
                      { value: 'stripe', label: 'Stripe' },
                      { value: 'payoneer', label: 'Payoneer' },
                      { value: 'wise', label: 'Wise' },
                      { value: 'airwallex', label: 'Airwallex' },
                      { value: 'dlocal', label: 'dLocal' },
                    ]}
                  />

                  <Select
                    label="Currency"
                    name="currency"
                    value={paymentData.currency}
                    onChange={handlePaymentChange}
                    options={[
                      { value: 'USD', label: 'USD ($)' },
                      { value: 'EUR', label: 'EUR (€)' },
                      { value: 'GBP', label: 'GBP (£)' },
                      { value: 'NGN', label: 'NGN (₦)' },
                      { value: 'KES', label: 'KES (Ksh)' },
                    ]}
                  />

                  <Input
                    label="Cardholder Name"
                    name="cardholderName"
                    value={paymentData.cardholderName}
                    onChange={handlePaymentChange}
                    error={errors.cardholderName}
                  />

                  <Input
                    label="Card Number"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentChange}
                    error={errors.cardNumber}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={handlePaymentChange}
                      error={errors.expiryDate}
                    />
                    <Input
                      label="CVV"
                      name="cvv"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={handlePaymentChange}
                      error={errors.cvv}
                    />
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button fullWidth type="submit">
                      Review Order
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Order</h2>

                <div className="space-y-6">
                  {/* Shipping Summary */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                    <p className="text-gray-600">
                      {shippingData.firstName} {shippingData.lastName}
                      <br />
                      {shippingData.address}
                      <br />
                      {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                      <br />
                      {shippingData.country}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                    <p className="text-gray-600">
                      {paymentData.paymentProvider.toUpperCase()}
                      <br />
                      Card ending in {paymentData.cardNumber.slice(-4)}
                    </p>
                  </div>

                  {/* Items Summary */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-gray-600">
                          <span>{item.name} x {item.quantity}</span>
                          <span>{item.currency} {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button fullWidth onClick={handlePayment}>
                      Complete Purchase
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-4 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>{item.name} x {item.quantity}</span>
                    <span className="font-medium">
                      {item.currency} {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{summary.currency} {summary.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>{summary.currency} {summary.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg text-sm text-green-900">
                ✓ Secure payment
                <br />✓ Money-back guarantee
                <br />✓ Fast processing
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
