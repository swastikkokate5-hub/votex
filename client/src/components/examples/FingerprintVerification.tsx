import FingerprintVerification from '../FingerprintVerification';

export default function FingerprintVerificationExample() {
  return (
    <FingerprintVerification
      voterName="Rajesh Kumar"
      onVerified={(score) => console.log('Fingerprint verified with score:', score)}
      onRejected={() => console.log('Fingerprint verification rejected')}
      onBack={() => console.log('Back clicked')}
    />
  );
}
