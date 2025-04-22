// "use client";

// interface MessageSearchProps {
//   value: string;
//   onChange: (query: string) => void;
//   onClear?: () => void;
// }

// export default function MessageSearch({
//   value,
//   onChange,
//   onClear,
// }: MessageSearchProps) {
//   return (
//     <div className="relative">
//       <input
//         type="text"
//         placeholder="Search conversations…"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       {value && onClear && (
//         <button
//           onClick={onClear}
//           aria-label="Clear search"
//           className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//         >
//           ✕
//         </button>
//       )}
//     </div>
//   );
// }
