import { Suspense } from 'react';
import { MousePointer2, Sparkles, BadgeDollarSign } from 'lucide-react';
import { ScootyDiorama } from '../components/three/ScootyDiorama';

export const Demo3DPage = () => {
  return (
    <div className="min-h-screen bg-[#ECE7DE] dark:bg-[#ECE7DE] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 border border-black/10 text-xs font-semibold text-gray-700 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#caa400]" />
            Prototype · real-time 3D
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-gray-900">
            SCOOTY in <span className="text-[#caa400]">3D</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            A live, interactive isometric scene rendered in your browser — the same Argo-style look,
            built entirely in code. Drag to rotate, scroll to zoom.
          </p>
        </div>

        {/* Canvas card */}
        <div className="relative rounded-3xl overflow-hidden border border-black/10 shadow-2xl shadow-black/10 bg-[#ECE7DE]">
          <div className="h-[62vh] min-h-[440px] w-full">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-gray-500">Loading 3D…</div>}>
              <ScootyDiorama />
            </Suspense>
          </div>

          {/* drag hint */}
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-black/55 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-full">
            <MousePointer2 className="w-3.5 h-3.5" />
            Drag to rotate · scroll to zoom
          </div>
        </div>

        {/* Notes */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          <div className="rounded-2xl border border-black/10 bg-white/60 p-5">
            <BadgeDollarSign className="w-5 h-5 text-[#caa400] mb-2" />
            <h3 className="font-bold text-gray-900 mb-1">$0 / no subscriptions</h3>
            <p className="text-sm text-gray-600">Pure code with three.js + react-three-fiber, already in the project. No assets, no paid tools.</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/60 p-5">
            <Sparkles className="w-5 h-5 text-[#caa400] mb-2" />
            <h3 className="font-bold text-gray-900 mb-1">Fully editable</h3>
            <p className="text-sm text-gray-600">Colors, props, camera, motion — all parameters I can tune. Swap the scooter, add buildings, change the palette.</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/60 p-5">
            <MousePointer2 className="w-5 h-5 text-[#caa400] mb-2" />
            <h3 className="font-bold text-gray-900 mb-1">Interactive</h3>
            <p className="text-sm text-gray-600">Rotates on its own and responds to the cursor. Can also drive scroll-linked motion on the homepage.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
