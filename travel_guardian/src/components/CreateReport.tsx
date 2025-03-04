"use client";
import { createReport } from "@/model/report";
import { Component } from "react";

type Props = {
  locationId: number;
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
    });
    
  }

  render() {
    const {name, desc} = this.state;
    return (
      <div className="flex justify-center items-center">
        <form className="flex flex-col space-y-4 p-4 w-1/2">
          <h2 className="text-xl font-bold">Create Report</h2>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            onChange={(e) => this.setState({ name: e.target.value })}
            value={name}
          />
          <label>Description:</label>

          <input
            type="text"
            name="desc"
            onChange={(e) => this.setState({ desc: e.target.value })}
            value={desc}
          />
          <button onClick={this.submit}>Submit</button>
        </form>
      </div>
    );
  }
}
