import VoteSuccess from '../VoteSuccess';

export default function VoteSuccessExample() {
  return (
    <VoteSuccess
      voterId="VOT123456789"
      candidateName="Rajiv Sharma - Progressive Party"
      boothId="BH-042"
      timestamp={new Date().toLocaleString()}
      onReturnToDashboard={() => console.log('Return to dashboard clicked')}
    />
  );
}
