import CameraMonitor from '../CameraMonitor';

export default function CameraMonitorExample() {
  return (
    <div className="flex gap-4 flex-wrap">
      <CameraMonitor isActive={true} size="small" />
      <CameraMonitor isActive={true} size="large" />
    </div>
  );
}
