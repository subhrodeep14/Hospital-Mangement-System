// import { useState } from "react";
// import { axiosClient } from '../api/axiosClient';
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     unitId: "",
//     adminCode: "",
//   });

//  const UNITS = [
   
//   { id: 1, name: "Neotia Getwel Multispecialty Hospital - Siliguri" },
//   { id: 2, name: "Neotia Bhagirathi Women & Child Care Center - Rawdon Street" },
//   { id: 3, name: "Neotia Bhagirathi Women & Child Care Center - New Town" },
//   { id: 4, name: "Neotia Bhagirathi Woman and Child Care Centre – Guwahati" },
//   { id: 5, name: "Neotia Bhagirathi Woman and Child Care Centre – Raipur" },


//   ] ;
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//  // const [error, setError] = useState(null);
//   //const [success, setSuccess] = useState(null);
//   const [error, setError] = useState<string | null>(null);
// const [success, setSuccess] = useState<string | null>(null);


//   const isAdmin = form.adminCode.trim().length > 0;

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setForm((prev) => ({
// //       ...prev,
// //       [e.target.name]: e.target.value,
// //     }));
// //   };
//   const handleChange = (
//   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
// ) => {
//   const { name, value } = e.target;

//   setForm((prev) => ({
//     ...prev,
//     [name]: value,
//   }));
// };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     if (!form.name || !form.email || !form.password) {
//       setError("Name, email and password are required");
//       return;
//     }

//     if (!isAdmin && !form.unitId) {
//       setError("Unit ID is required for employees");
//       return;
//     }

//     try {
//       setLoading(true);

//       await axiosClient.post("/auth/register", {
//         name: form.name,
//         email: form.email,
//         password: form.password,
//         phone: form.phone,
//         unitId: isAdmin ? null : form.unitId,
//         adminCode: form.adminCode || null,
//       });

//       setSuccess("Registration successful. You can now login.");
//       setSuccess("Registration successful! Redirecting...");

// setTimeout(() => {
//   navigate("/", { replace: true });
// }, 1500);

    
//     } catch (err: any) {
//       console.error(err);

//       let message = "Registration failed";
//       if (err.response?.data?.message) {
//         message = err.response.data.message;
//       }

//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br w-full from-blue-50 to-indigo-100 px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
//         <h1 className="text-2xl font-bold text-center text-gray-800">
//           Create Account
//         </h1>
//         <p className="text-sm text-center text-gray-500 mb-6">
//           Ticket Management System
//         </p>

//         {error && (
//           <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
//             {success}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             name="name"
//             placeholder="Full Name *"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address *"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password *"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
//           />

//           <input
//             type="tel"
//             name="phone"
//             placeholder="Phone Number"
//             value={form.phone}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
//           />

//           {/* <input
//             name="unitId"
//             placeholder="Unit ID (Employees only)"
//             value={form.unitId}
//             onChange={handleChange}
//             disabled={isAdmin}
//             className={`w-full px-4 py-3 rounded-lg border outline-none ${
//               isAdmin
//                 ? "bg-gray-100 cursor-not-allowed"
//                 : "focus:ring-2 focus:ring-indigo-500"
//             }`}
//           /> */}

//           <select
//   name="unitId"
//   value={form.unitId}
//   onChange={handleChange}
//   disabled={isAdmin}
//   className={`w-full px-4 py-3 rounded-lg border outline-none ${
//     isAdmin
//       ? "bg-gray-100 cursor-not-allowed"
//       : "focus:ring-2 focus:ring-indigo-500"
//   }`}
// >
//   <option value="">Select Unit *</option>

//   {UNITS.map((unit) => (
//     <option key={unit.id} value={unit.id}>
//       {unit.name}
//     </option>
//   ))}
// </select> <p className="text-xs text-gray-500">
//             Employees only
//           </p>

//           <input
//             name="adminCode"
//             placeholder="Admin Code (Optional)"
//             value={form.adminCode}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
//           />

//           <p className="text-xs text-gray-500">
//             Admin code is only for authorized administrators.
//           </p>

//           <button
//             disabled={loading}
//             className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
//           >
//             {loading ? "Creating account..." : "Register"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { axiosClient } from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    unitId: "",
    role: "employee",
    department: "",
    adminCode: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ---------------- CONSTANT DATA ---------------- */

  const UNITS = [
    { id: 1, name: "Neotia Getwel Multispecialty Hospital - Siliguri" },
    { id: 2, name: "Neotia Bhagirathi Women & Child Care Center - Rawdon Street" },
    { id: 3, name: "Neotia Bhagirathi Women & Child Care Center - New Town" },
    { id: 4, name: "Neotia Bhagirathi Woman and Child Care Centre – Guwahati" },
    { id: 5, name: "Neotia Bhagirathi Woman and Child Care Centre – Raipur" },
  ];

  const DEPARTMENTS = [
    "Emergency",
    "ICU",
    "Operation Theatre",
    "Radiology",
    "Pathology",
    "Pharmacy",
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Gynecology",
    "Orthopedics",
    "Administration",
    "Maintenance",
    "Housekeeping",
    "IT Support",
  ];

  const ROLES = ["admin", "manager", "employee"];

  const isAdmin = form.role === "admin";

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required");
      return;
    }

    if (!form.department) {
      setError("Department is required");
      return;
    }

    // Only admin can skip unit
    if (!isAdmin && !form.unitId) {
      setError("Unit is required");
      return;
    }

    try {
      setLoading(true);

      await axiosClient.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
        department: form.department,
        unitId: isAdmin ? null : Number(form.unitId),
        adminCode:
          form.role === "admin" || form.role === "manager"
            ? form.adminCode
            : null,
      });

      setSuccess("Registration successful! Redirecting...");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br w-full from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Create Account
        </h1>

        <p className="text-sm text-center text-gray-500 mb-6">
          Ticket Management System
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <input
            name="name"
            placeholder="Full Name *"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password *"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* PHONE */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* ROLE */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r.toUpperCase()}
              </option>
            ))}
          </select>

          {/* DEPARTMENT */}
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Department *</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* UNIT */}
          <select
            name="unitId"
            value={form.unitId}
            onChange={handleChange}
            disabled={isAdmin}
            className={`w-full px-4 py-3 rounded-lg border outline-none ${
              isAdmin
                ? "bg-gray-100 cursor-not-allowed"
                : "focus:ring-2 focus:ring-indigo-500"
            }`}
          >
            <option value="">Select Unit *</option>
            {UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {!isAdmin && (
            <p className="text-xs text-gray-500">
              Unit selection is mandatory
            </p>
          )}

          {/* ADMIN CODE */}
          {(form.role === "admin" || form.role === "manager") && (
            <>
              <input
                name="adminCode"
                placeholder="Admin Code *"
                value={form.adminCode}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <p className="text-xs text-gray-500">
                Required for admin & manager roles
              </p>
            </>
          )}

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
