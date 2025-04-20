"use client";
import { createReport } from "@/model/report";
import { riskColors } from "@/model/risk";
import { Component } from "react";

type Props = {
  locationId: number;
  close: () => void;
  userId: number;
};

type State = {
  name: string;
  desc: string;
  risk: string;
};

export default class CreateReport extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: "",
      desc: "",
      risk: "none",
    };

    this.submit = this.submit.bind(this);
  }

  submit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    const { name, desc, risk } = this.state;
    const { locationId, userId } = this.props;

    createReport(name, desc, risk, locationId, userId).then((report) => {
      this.setState({ name: "", desc: "" });
      this.props.close();
    });
  }

  render() {
    const { name, desc, risk } = this.state;
    return (
      <div className="flex justify-center items-center w-full">
        <form className="flex flex-col space-y-4 p-4 w-full">
          <h2 className="text-xl font-bold">Create Report</h2>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            className="text-black w-60 px-4 py-2 w-full"
            onChange={(e) => this.setState({ name: e.target.value })}
            value={name}
          />
          <label htmlFor="desc">Description:</label>
          <textarea
            id="desc"
            name="desc"
            onChange={(e) => this.setState({ desc: e.target.value })}
            className="text-black text-sm px-4 py-2 resize-none"
            rows={8}
            value={desc}
          ></textarea>
          <label htmlFor="risk">Risk Level:</label>
          <select
            id="risk"
            name="risk"
            value={risk}
            onChange={(e) => {
              this.setState({
                risk: e.target.value,
              });
            }}
            className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${riskColors(
              risk
            )}`}
          >
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="severe">Severe</option>
          </select>

          <button
            onClick={this.submit}
            className="bg-blue-900 text-white p-2 rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}
