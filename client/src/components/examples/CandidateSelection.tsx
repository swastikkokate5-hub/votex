import CandidateSelection from '../CandidateSelection';

export default function CandidateSelectionExample() {
  // todo: remove mock functionality
  const mockCandidates = [
    { id: "1", name: "Rajiv Sharma", partyName: "Progressive Party", partySymbol: "lotus" },
    { id: "2", name: "Meera Reddy", partyName: "Unity Alliance", partySymbol: "hand" },
    { id: "3", name: "Arjun Patel", partyName: "Democratic Front", partySymbol: "elephant" },
    { id: "4", name: "Kavita Singh", partyName: "People's Movement", partySymbol: "wheel" },
  ];

  return (
    <CandidateSelection
      candidates={mockCandidates}
      onSubmit={(id) => console.log('Vote submitted for candidate:', id)}
      onBack={() => console.log('Back clicked')}
    />
  );
}
