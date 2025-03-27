"use client";
import { createReport } from "@/model/report";
import { Component } from "react";

type Props = {
  locationId: number;
  close: () => void;
  /*userId: number;*/
};

type State = {
  name: string;
  desc: string;
};

export default class CreateReport extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: "",
      desc: "",
    };

    this.submit = this.submit.bind(this);
  }

  submit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    const { name, desc } = this.state;
    const { locationId } = this.props;

    createReport(name, desc, locationId).then((report) => {
      console.log("Created report with id", report.id);
      this.setState({ name: "", desc: "" });
      this.props.close();
    });

  }

  render() {
    const {name, desc} = this.state;
    return (
        <div className="flex justify-center items-center">
          <form className="flex flex-col space-y-4 p-4">
            <h2 className="text-xl font-bold">Create Report</h2>
            <label htmlFor="name">Name:</label>
            <input
                id="name"
                type="text"
                name="name"
                className="text-black w-60 px-4 py-2"
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
            <button
                onClick={this.submit}
                className="bg-blue-900 text-white p-2 rounded-lg"
            >Submit</button>
          </form>
        </div>
    );
  }
}