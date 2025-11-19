import FaceVerification from '../FaceVerification';

export default function FaceVerificationExample() {
  // todo: remove mock functionality
  const mockVoter = {
    voterId: "VOT123456789",
    name: "Rajesh Kumar",
    age: 34,
    address: "123 Main Street, Mumbai, MH 400001",
  };

  return (
    <FaceVerification
      voter={mockVoter}
      onVerified={(score) => console.log('Face verified with score:', score)}
      onRejected={() => console.log('Face verification rejected')}
      onBack={() => console.log('Back clicked')}
    />
  );
}
