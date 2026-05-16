import { useEffect, useState } from "react";
import axios from "axios";

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
}

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [status, setStatus] =
    useState("New");

  const [source, setSource] =
    useState("Website");

    const [search, setSearch] =
  useState("");

const [filterStatus, setFilterStatus] =
  useState("");

const [filterSource, setFilterSource] =
  useState("");

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `https://gigflow-backend-oun3.onrender.com/api/leads?search=${search}&status=${filterStatus}&source=${filterSource}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setLeads(response.data.leads);
    } catch (error) {
      console.log(error);
    }
  };

  const createLead = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://gigflow-backend-oun3.onrender.com/api/leads",
        {
          name,
          email,
          status,
          source,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setName("");
      setEmail("");
      setStatus("New");
      setSource("Website");

      fetchLeads();
    } catch (error) {
      console.log(error);
    }
  };

  const updateLeadStatus = async (
    id: string,
    newStatus: string
  ) => {
    try {
      const token = localStorage.getItem("token");
  
      await axios.put(
        `https://gigflow-backend-oun3.onrender.com/api/leads/${id}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
  
      fetchLeads();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteLead = async (
    id: string
  ) => {
    const confirmDelete = window.confirm(
      "Delete this lead?"
    );
  
    if (!confirmDelete) {
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      await axios.delete(
        `https://gigflow-backend-oun3.onrender.com/api/leads/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
  
      fetchLeads();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, filterStatus, filterSource]);

  return (
    <div className="p-6">
<div className="flex items-center justify-between mb-6">
  <h1 className="text-3xl font-bold">
    Leads Dashboard
  </h1>

  <button
    onClick={() => {
      localStorage.removeItem("token");
      window.location.href = "/";
    }}
    className="bg-black text-white px-5 py-2 rounded-md"
  >
    Logout
  </button>
</div>
      <div className="flex flex-wrap gap-4 mb-6">
  <input
    type="text"
    placeholder="Search leads"
    className="border p-3 rounded-md bg-white"
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
  />

  <select
    className="border p-3 rounded-md bg-white"
    value={filterStatus}
    onChange={(e) =>
      setFilterStatus(e.target.value)
    }
  >
    <option value="">
      All Status
    </option>

    <option value="New">
      New
    </option>

    <option value="Contacted">
      Contacted
    </option>

    <option value="Qualified">
      Qualified
    </option>

    <option value="Lost">
      Lost
    </option>
  </select>

  <select
    className="border p-3 rounded-md bg-white"
    value={filterSource}
    onChange={(e) =>
      setFilterSource(e.target.value)
    }
  >
    <option value="">
      All Sources
    </option>

    <option value="Website">
      Website
    </option>

    <option value="Instagram">
      Instagram
    </option>

    <option value="Referral">
      Referral
    </option>
  </select>
</div>

      <form
        onSubmit={createLead}
        className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4"
      >
        <input
          type="text"
          placeholder="Lead name"
          className="border p-3 rounded-md"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Lead email"
          className="border p-3 rounded-md"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <select
          className="border p-3 rounded-md"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Lost</option>
        </select>

        <select
          className="border p-3 rounded-md"
          value={source}
          onChange={(e) =>
            setSource(e.target.value)
          }
        >
          <option>Website</option>
          <option>Instagram</option>
          <option>Referral</option>
        </select>

        <button className="bg-black text-white px-6 rounded-md">
          Add Lead
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">
                Name
              </th>

              <th className="text-left p-4">
                Email
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Source
              </th>
              <th className="text-left p-4">
  Action
</th>

            </tr>
          </thead>

          <tbody>
          {leads.length === 0 ? (
  <tr>
    <td
      colSpan={5}
      className="text-center p-6"
    >
      No leads found
    </td>
  </tr>
) : (
  leads.map((lead) => (
              <tr
                key={lead._id}
                className="border-t"
              >
                <td className="p-4">
                  {lead.name}
                </td>

                <td className="p-4">
                  {lead.email}
                </td>
                <td className="p-4">
  <select
    value={lead.status}
    onChange={(e) =>
      updateLeadStatus(
        lead._id,
        e.target.value
      )
    }
    className="border rounded-md p-2"
  >
    <option>New</option>

    <option>Contacted</option>

    <option>Qualified</option>

    <option>Lost</option>
  </select>
</td>

                <td className="p-4">
                  {lead.source}
                </td>
                <td className="p-4">
  <button
    onClick={() =>
      deleteLead(lead._id)
    }
    className="bg-red-500 text-white px-4 py-2 rounded-md"
  >
    Delete
  </button>
</td>

              </tr>
))
)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;