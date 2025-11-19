import VoterIdentification from '../VoterIdentification';

export default function VoterIdentificationExample() {
  return (
    <VoterIdentification
      onSubmit={(id) => console.log('Voter ID submitted:', id)}
      onBack={() => console.log('Back clicked')}
    />
  );
}
