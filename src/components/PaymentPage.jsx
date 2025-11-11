// frontend/src/components/PaymentPage.jsx
import React, { useState } from 'react';
import axios from 'axios';

// 🔑 Clés fixes (intégrées dans le build)
const API_KEY = process.env.REACT_APP_API_KEY || 'pk_1696f0e8afb658232ff78d2043ae32392c0ced639e8f5f8f';
const MERCHANT_ID = process.env.REACT_APP_MERCHANT_ID || '690fef3ee9d765d23af00602';

export default function PaymentPage() {
  const [phoneSuffix, setPhoneSuffix] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('orange');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const amount = 10000; // Montant fixe

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phoneSuffix.length !== 9 || !/^\d{9}$/.test(phoneSuffix)) {
      alert('Veuillez entrer un numéro de téléphone valide (9 chiffres).');
      return;
    }

    const fullPhone = `237${phoneSuffix}`;
    const operator = paymentMethod === 'orange' ? 'ORANGE' : 'MTN';

    setLoading(true);
    setStatus('pending');
    setMessage('💳 Paiement en cours...');

    try {
      // ✅ Appel via PROXY (donc pas besoin de BACKEND_URL)
      await axios.post('/api/v1/payments/initiate', {
        amount,
        customer_phone: fullPhone,
        operator,
        merchant_id: MERCHANT_ID
      }, {
        headers: { 'x-api-key': API_KEY }
      });

      setMessage('✅ Paiement initié ! Veuillez confirmer sur votre téléphone.');
      setStatus('success');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors du paiement';
      setMessage(`❌ ${errorMsg}`);
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Frais de la demande</h1>
        <div style={styles.amount}>{new Intl.NumberFormat('fr-FR').format(amount)} Fr. CFA</div>
        <div style={styles.description}>
          Assuré d’avoir <strong>{new Intl.NumberFormat('fr-FR').format(amount)} Fr. CFA</strong> dans votre compte
          <strong> Orange Money</strong> ou <strong> Mobile Money</strong>.
        </div>

        <div style={styles.paymentMethods}>
          <label style={labelStyle(paymentMethod === 'orange')}>
            <input
              type="radio"
              name="payment"
              value="orange"
              checked={paymentMethod === 'orange'}
              onChange={() => setPaymentMethod('orange')}
              style={{ marginRight: '10px', accentColor: '#004aad' }}
            />
            Orange Money
          </label>
          <br />
          <label style={labelStyle(paymentMethod === 'momo')}>
            <input
              type="radio"
              name="payment"
              value="momo"
              checked={paymentMethod === 'momo'}
              onChange={() => setPaymentMethod('momo')}
              style={{ marginRight: '10px', accentColor: '#004aad' }}
            />
            Mobile Money
          </label>
        </div>

        <label style={styles.label}>Numéro de téléphone</label>
        <div style={styles.phoneWrapper}>
          <div style={styles.prefix}>+237</div>
          <input
            type="text"
            value={phoneSuffix}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 9);
              setPhoneSuffix(v);
            }}
            placeholder="Entrez 9 chiffres"
            maxLength={9}
            style={styles.input}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Envoi...' : 'Payer'}
        </button>

        {status && (
          <div style={status === 'success' ? styles.success : styles.error}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: isActive ? '#eaf1ff' : '#f5f7ff',
  border: `1px solid ${isActive ? '#004aad' : '#d4d9f2'}`,
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '10px',
  cursor: 'pointer',
  fontSize: '15px',
  color: '#333',
  transition: 'all 0.3s ease'
});

const styles = {
  container: {
    fontFamily: "'Poppins', Arial, sans-serif",
    background: 'linear-gradient(to bottom right, #e8f0ff, #f9fbff)',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh'
  },
  card: {
    backgroundColor: 'white',
    padding: '30px 25px',
    borderRadius: '14px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    maxWidth: '400px',
    width: '90%'
  },
  title: {
    textAlign: 'center',
    color: '#004aad',
    fontSize: '26px',
    fontWeight: '700',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  amount: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px'
  },
  description: {
    textAlign: 'center',
    color: '#555',
    fontSize: '15px',
    marginBottom: '25px',
    lineHeight: '1.5'
  },
  label: {
    display: 'block',
    marginTop: '20px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px'
  },
  phoneWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  prefix: {
    backgroundColor: '#eef3ff',
    color: '#004aad',
    padding: '10px 12px',
    fontWeight: '600',
    fontSize: '15px'
  },
  input: {
    flex: 1,
    padding: '10px',
    border: 'none',
    fontSize: '16px',
    outline: 'none'
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '10px',
    fontSize: '18px',
    cursor: 'pointer',
    marginTop: '25px',
    fontWeight: '600'
  },
  success: {
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '20px',
    color: 'green'
  },
  error: {
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '20px',
    color: 'red'
  }
};