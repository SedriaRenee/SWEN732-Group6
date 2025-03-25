"use client";
import {createDiscussion} from "@/model/discussions";
import { Component } from "react";

type Props = {
    locationId: number;
    close: () => void;
    userId: number;
};

type State = {
    title: string;
    content: string;
};

export default class CreateNote extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            title: "",
            content: "",
        };
    }
    handleSubmit(){
        createDiscussion(this.state.title,this.state.content,this.props.userId,this.props.locationId);
        this.setState({ title: "", content: "" });
        this.props.close();
    }

render(){
    const {title, content} = this.state;
    return (
        <div className="flex justify-center items-center">
            <form className="flex flex-col space-y-4 p-4">
                <h2 className="text-xl font-bold">Create Note</h2>
                <label htmlFor="title">Title:</label>
                <input
                    id="title"
                    type="text"
                    required
                    name="title"
                    className="text-black w-60 px-4 py-2"
                    onChange={(e) => this.setState({ title: e.target.value })}
                    value={title}
                />
                <label htmlFor="content">Description:</label>
                <textarea
                    id="content"
                    name="content"
                    placeholder="Write your question here"
                    onChange={(e) => this.setState({ content: e.target.value })}
                    className="text-black text-sm px-4 py-2 resize-none"
                    rows={8}
                    value={content}
                ></textarea>
                <button
                    onSubmit={()=>this.handleSubmit()}
                    className="bg-blue-900 text-white p-2 rounded-lg"
                    type="submit"
                >Submit</button>
            </form>
        </div>
    );
  }
}
