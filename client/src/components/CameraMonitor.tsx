import { useEffect, useRef, useState } from "react";
import { Camera, Circle, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Assuming shadcn/ui Progress; adjust if needed
import {
  FaceDetector,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

interface CameraMonitorProps {
  isActive: boolean;
  onScanComplete?: (scanData: { confidence: number; timestamp: number }) => void; // New: Callback for scan complete
  size?: "small" | "large";
}

export default function CameraMonitor({
  isActive,
  onScanComplete,
  size = "small",
}: CameraMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0); // New: Progress for scanning (0-100)
  const [isScanComplete, setIsScanComplete] = useState(false); // New: Track completion
  const detectorRef = useRef<FaceDetector | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionCountRef = useRef(0); // New: Count stable detections for progress

  // Resize canvas to match video element size (critical for correct overlay)
  const resizeCanvas = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth || !video.videoHeight) return;

    // Set canvas resolution to actual video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  };

  useEffect(() => {
    if (!isActive) {
      setScanProgress(0);
      setIsScanComplete(false);
      detectionCountRef.current = 0;
      return;
    }

    let isMounted = true;
    const MIN_DETECTIONS_FOR_SCAN = 90; // ~3 seconds at 30fps for stable scan

    const startCamera = async () => {
      try {
        console.log("Loading MediaPipe vision tasks..."); // Debug log

        // 1. Load MediaPipe WASM + model (updated to official latest URL)
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
            // delegate: "GPU", // Uncomment for faster perf if your device supports it
          },
          runningMode: "VIDEO",
          minDetectionConfidence: 0.7,
        });

        console.log("FaceDetector initialized successfully!"); // Debug log

        if (!isMounted) {
          detector.close();
          return;
        }
        detectorRef.current = detector;

        // 2. Get webcam stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            resizeCanvas();
          };
          videoRef.current.onresize = resizeCanvas; // for mobile orientation changes
        }

        // 3. Detection loop with scanning progress
        const detect = async () => {
          if (!isMounted) return;
          if (!videoRef.current || !canvasRef.current || !detectorRef.current) return;

          // Wait until video has real frames
          if (videoRef.current.readyState < 2) {
            animationFrameRef.current = requestAnimationFrame(detect);
            return;
          }

          const startTimeMs = performance.now();
          const results = await detectorRef.current.detectForVideo(
            videoRef.current,
            startTimeMs
          );

          const ctx = canvasRef.current.getContext("2d");
          if (!ctx) return;

          ctx.save();
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          let faceDetected = false;
          if (results.detections.length > 0) {
            faceDetected = true;
            const drawingUtils = new DrawingUtils(ctx);
            for (const detection of results.detections) {
              // Type guard for optional boundingBox
              if (detection.boundingBox) {
                drawingUtils.drawBoundingBox(detection.boundingBox, {
                  color: "#22c55e",
                  lineWidth: 4,
                  fillColor: "#00000000",
                });
              }
            }

            // New: Increment detection count for scanning progress (only if face is centered/stable)
            if (results.detections.length === 1) { // Single face for better accuracy
              detectionCountRef.current++;
            }
          } else {
            // Reset progress if face leaves frame (encourages steady positioning)
            if (detectionCountRef.current > 0) {
              detectionCountRef.current = Math.max(0, detectionCountRef.current - 5); // Gentle decay
            }
          }

          // New: Update progress based on detection count
          const progress = Math.min((detectionCountRef.current / MIN_DETECTIONS_FOR_SCAN) * 100, 100);
          setScanProgress(progress);

          // New: Trigger complete if progress reaches 100%
          if (progress >= 100 && !isScanComplete && onScanComplete) {
            setIsScanComplete(true);
            onScanComplete({ confidence: 0.87, timestamp: Date.now() }); // Mock confidence; replace with real calc
          }

          ctx.restore();

          animationFrameRef.current = requestAnimationFrame(detect);
        };

        detect();
      } catch (err: any) {
        console.error("Detailed CameraMonitor error:", err); // Better logging
        if (isMounted) {
          setError(
            err.name === "NotAllowedError"
              ? "Camera access denied. Please allow camera permission and refresh."
              : err.message?.includes("fetch") || err.message?.includes("load")
              ? "Model failed to load from Google servers. Check your internet connection or try again."
              : "Failed to initialize face detection. Check browser console for details."
          );
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (detectorRef.current) {
        detectorRef.current.close();
      }
    };
  }, [isActive, onScanComplete]);

  // Responsive card size
  const cardClass = size === "small" ? "w-64 h-48" : "w-full aspect-video";

  return (
    <Card className={cardClass}>
      <div className="relative w-full h-full bg-black rounded-md overflow-hidden flex items-center justify-center">
        {/* Video feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" // mirror webcam
        />

        {/* Face detection overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" // mirror canvas too
        />

        {/* Fallback state */}
        {!isActive || error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-black/50 rounded-md">
            <Camera className={size === "small" ? "w-12 h-12" : "w-20 h-20"} />
            {error && <p className="text-xs text-red-500 mt-2 max-w-xs text-center">{error}</p>}
            {!isActive && <p className="text-xs mt-2">Camera inactive</p>}
          </div>
        ) : null}

        {/* Recording indicator (unchanged) */}
        {isActive && !error && (
          <>
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse">
              <Circle className="w-3 h-3 fill-current" />
              LIVE
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-medium">
              Camera Active – Do Not Leave Seat
            </div>
          </>
        )}

        {/* New: Scan Progress Bar (below video, doesn't overlap existing UI) */}
        {isActive && !error && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50">
            <Progress value={scanProgress} className="w-full h-1.5" />
            <p className="text-xs text-white text-center mt-1">
              {scanProgress < 100 ? `Scan Progress: ${Math.round(scanProgress)}%` : "Scan Complete!"}
            </p>
          </div>
        )}

        {/* New: Completion Check Icon (overlay on video when done) */}
        {isScanComplete && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
            <Check className="w-16 h-16 text-green-400 animate-bounce" />
          </div>
        )}
      </div>
    </Card>
  );
}