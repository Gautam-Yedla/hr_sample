import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from "react-icons/fa";

const LeaveDetails = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      console.error("Error: Leave ID is undefined");
      return;
    }

    const fetchLeave = async () => {
      try {
        console.log("Fetching leave details for ID:", id);

        if (!id || id.length !== 24) {
          console.error("Invalid leave ID:", id);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/leave/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setLeave(response.data.leave);
        } else {
          console.error("Failed to fetch leave details:", response.data.message);
        }
      } catch (error) {
        console.error(error);
        alert("Error fetching leave details!");
      }
    };

    fetchLeave();
  }, [id]);

  const changeStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this leave request?`)) {
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/leave/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        alert(`Leave ${status} successfully!`);
        navigate(-1);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error updating leave status!");
    }
  };

  return (
    <>
      {leave ? (
        <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 transform transition-all hover:shadow-3xl">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Leave Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex justify-center items-center">
              <img
                src={
                  leave?.employeeId?.userId?.profileImage
                    ? `http://localhost:5000/${leave.employeeId.userId.profileImage}`
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="rounded-full border-4 border-teal-500 w-44 h-44 object-cover shadow-lg hover:scale-105 transform transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-4 text-gray-700">
              <div className="flex items-center space-x-3">
                <FaUserCircle className="text-teal-500 text-xl" />
                <p className="font-semibold">Name:</p>
                <span>{leave.employeeId.userId.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <p className="font-semibold">Employee ID:</p>
                <span>{leave.employeeId.employeeId}</span>
              </div>
              <div className="flex items-center space-x-3">
                <p className="font-semibold">Department:</p>
                <span>{leave.employeeId.department.dep_name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <p className="font-semibold">Leave Type:</p>
                <span>{leave.leaveType}</span>
              </div>
              <div className="flex items-center space-x-3">
                <p className="font-semibold">Reason:</p>
                <span>{leave.reason}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="text-yellow-500" />
                <p className="font-semibold">Start Date:</p>
                <span>{new Date(leave.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="text-red-500" />
                <p className="font-semibold">End Date:</p>
                <span>{new Date(leave.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-3">
                <p className="font-semibold">Status:</p>
                {leave.status === "Approved" ? (
                  <span className="flex items-center text-green-600 font-bold">
                    <FaCheckCircle className="mr-1" /> {leave.status}
                  </span>
                ) : leave.status === "Rejected" ? (
                  <span className="flex items-center text-red-600 font-bold">
                    <FaTimesCircle className="mr-1" /> {leave.status}
                  </span>
                ) : (
                  <span className="text-yellow-500 font-bold">{leave.status}</span>
                )}
              </div>
              {leave.status === "Pending" && (
                <div className="flex space-x-4 mt-6">
                  <button
                    className="flex-1 px-5 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-lg transform hover:scale-105 transition-all"
                    onClick={() => changeStatus(leave._id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="flex-1 px-5 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg transform hover:scale-105 transition-all"
                    onClick={() => changeStatus(leave._id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-lg text-teal-600 mt-12 animate-pulse">
          Loading leave details...
        </div>
      )}
    </>
  );
};

export default LeaveDetails;
