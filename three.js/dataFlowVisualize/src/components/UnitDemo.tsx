export default function UnitDemo() {

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold mb-4">📏 Width Units Demo</h2>

      <div className="bg-gray-100 p-4 space-y-2 rounded-xl shadow">
        <div className="bg-blue-500 text-white p-2 w-[300px]">
          w-[300px] → Fixed 300 pixels
        </div>

        <div className="bg-green-500 text-white p-2 w-1/2">
          w-1/2 → 50% of parent width
        </div>

        <div className="bg-purple-500 text-white p-2 w-[30vw]">
          w-[30vw] → 30% of screen width
        </div>
      </div>


      <div className="w-[600px]">
        <div className="bg-blue-500 w-1/2">50%</div>
        <div className="bg-green-500 w-[50vw]">50vw</div>
      </div>


      <p className="text-gray-600 text-sm italic">
        Resize your screen to see how % and vw units respond. `px` stays the same!
      </p>
    </div>
  );
}
