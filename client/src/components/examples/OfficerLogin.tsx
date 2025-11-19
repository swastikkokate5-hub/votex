import OfficerLogin from '../OfficerLogin';

export default function OfficerLoginExample() {
  return <OfficerLogin onLogin={(id, pwd) => console.log('Login:', id, pwd)} />;
}
