"use client";
import { createDiscussion } from "@/model/discussions";
import React, { Component } from "react";
import { Button, Input, Textarea,Form} from "@heroui/react";

type Props = {
    locationId: number;
    close: () => void;
    userId: number;
};

type State = {
    title: string;
    content: string;
};

export default class CreateDiscus extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            title: "",
            content: "",
        };
    }

    handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createDiscussion(this.state.title, this.state.content, this.props.userId, this.props.locationId);
        this.setState({ title: "", content: "" });
        this.props.close();
    };

    render() {
        const { title, content } = this.state;
        return (
            <div className="flex justify-center items-center">
                <Form className="flex flex-col space-y-4 p-4" onSubmit={this.handleSubmit}>
                    <h2 className="text-xl font-bold">Create Discussion</h2>

                    <Input
                        label="Title: "
                        labelPlacement={"outside"}
                        id="title"
                        type="text"
                        placeholder="Title"
                        required
                        name="title"
                        className="w-max m-auto h-max px-4 py-2 text-black bg-[#222222] "
                        onChange={(e) => this.setState({ title: e.target.value })}
                        value={title}
                    />

                    <Textarea
                        label="Content:"
                        labelPlacement={"outside"}
                        id="content"
                        name="content"
                        placeholder="Write your question here"
                        onChange={(e) => this.setState({ content: e.target.value })}
                        className="w-max m-auto h-max px-4 py-2 text-black bg-[#222222] "
                        rows={8}
                        value={content}
                    />

                    <Button
                        className="bg-blue-900 text-white p-2 rounded-lg w-full"
                        type="submit"

                    >
                        Submit
                    </Button>
                </Form>
            </div>
        );
    }
}
