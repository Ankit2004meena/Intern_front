import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DetailApplication() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    room: "",
    link: "",
  });

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const id = params.get("a");

  // ✅ Fetch application once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://intern-backend-kneh.onrender.com/api/application/${id}`
        );
        setData(response.data); // store as object
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };
    fetchData();
  }, [id]);

  // ✅ Accept / Reject / Interview handler
  const handleAcceptAndReject = async (id, action) => {
    try {
      const payload = { action };

      if (action === "interview") {
        payload.date = formData.date;
        payload.time = formData.time;
        payload.room = formData.room;
        payload.link = formData.link;

        // simple validation
        if (!formData.date || !formData.time || !formData.room || !formData.link) {
          alert("Please fill all interview fields");
          return;
        }
      }

      const response = await axios.put(
        `https://intern-backend-kneh.onrender.com/api/application/${id}`,
        payload
      );

      setData(response.data.data); // ✅ directly update object

      if (action === "accepted") {
        alert("Application accepted");
      } else if (action === "interview") {
        alert("Interview scheduled");
      } else {
        alert("Application rejected");
      }

      navigate("/applications");
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <section className="body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <img
            alt="user"
            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover rounded-xl shadow-md"
            src={data.user?.photo || "/default-avatar.png"}
          />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm font-bold text-gray-600 mb-2">Company Name</h2>
            <h1 className="text-gray-800 text-xl font-semibold mb-4">
              {data.company}
            </h1>

            <h2 className="font-bold text-lg">Cover Letter</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{data.coverLetter}</p>

            <div className="flex items-center gap-3 border-b pb-4 mb-6">
              <h1 className="font-bold text-gray-700">Application Date:</h1>
              <p>{new Date(data?.createdAt).toLocaleDateString()}</p>
            </div>

            <h4 className="mt-4 text-gray-700">Applied By:</h4>
            <p className="font-bold text-gray-900">{data.user?.name}</p>

            {/* Action Buttons */}
            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
                  onClick={() => handleAcceptAndReject(data._id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
                  onClick={() => handleAcceptAndReject(data._id, "rejected")}
                >
                  Reject
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
                  onClick={() => handleAcceptAndReject(data._id, "interview")}
                >
                  Interview
                </button>
              </div>

              {/* Interview Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  value={formData.date}
                />
                <input
                  type="time"
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  value={formData.time}
                />
                <input
                  type="text"
                  placeholder="Room No."
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, room: e.target.value })
                  }
                  value={formData.room}
                />
                <input
                  type="text"
                  placeholder="Meeting Link"
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  value={formData.link}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DetailApplication;
