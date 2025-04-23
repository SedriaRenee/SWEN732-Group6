"use client";
import React, {Component,} from "react";
import {Button, Input, Textarea, Form, Autocomplete, AutocompleteItem, Chip} from "@heroui/react";
import {PREFERENCE_TAGS} from "@/model/preferences";
import {createPost} from "@/model/companion";
import {getCountries} from "@/model/location";


type Props = {
    close: () => void;
    userId: number;
};
type LocationOption = {
    id: number;
    name: string;
};
type State = {
    title: string;
    content: string;
    startDate: Date | null;
    endDate: Date | null;
    locationInput: string;
    selectedLocation: { id: number; name: string } | null;
    selectedTags: string[];
    locationOptions: LocationOption[];
};

export default class CreatePost extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            title: "",
            content: "",
            startDate: null,
            endDate: null,
            locationInput: "",
            selectedLocation: null,
            selectedTags: [],
            locationOptions: []
        };
    }

    loadLocations = async ()=>{
        const countries = await getCountries();
        const options = countries.map(c => ({
            id: c.id,
            name: c.name,
        }));
        this.setState({ locationOptions: options });
    }


    handleTagToggle = (tag: string) => {
        this.setState(prev => ({
            selectedTags: prev.selectedTags.includes(tag)
                ? prev.selectedTags.filter(t => t !== tag)
                : [...prev.selectedTags, tag]
        }));
    };

    resetForm = () => {
        this.setState({
            title: "",
            content: "",
            startDate: null,
            endDate: null,
            locationInput: "",
            selectedLocation: null,
            selectedTags: []
        });
    };

    handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!this.state.selectedLocation) {
            alert("Please select a location");
            return;
        }
        try {
            await createPost(
                this.state.title,
                this.state.content,
                this.state.startDate,
                this.state.endDate,
                this.props.userId,
                this.state.selectedLocation.id,
                this.state.selectedTags
            );
            this.resetForm();
            this.props.close();
        } catch (error) {
            console.error("Failed to create post:", error);

        }
    }
    handleLocationSearch = (value: string) => {
        this.setState({ locationInput: value });
    };
    componentDidMount() {
        this.loadLocations();
    }
    filteredLocations = () => {
        return this.state.locationOptions.filter(location =>
            location.name.toLowerCase().includes(this.state.locationInput.toLowerCase())
        );
    };
    render() {

        const { title, content, startDate, endDate, selectedLocation, selectedTags } = this.state;

        return (
            <div className="flex justify-center items-center">
                <Form className="flex flex-col space-y-4 p-4" onSubmit={this.handleSubmit}>
                    <h2 className="text-xl font-bold p-5">Create Companion Post</h2>
                    <Input
                        label="Title"
                        labelPlacement="outside"
                        placeholder="Looking for travel buddies to..."
                        id="title"
                        type="text"
                        required
                        name="title"
                        onChange={(e) => this.setState({ title: e.target.value })}
                        value={title}
                    />

                    <Textarea
                        label="Details"
                        labelPlacement="outside"
                        placeholder="Describe your trip plans, what you're looking for in companions, etc."
                        id="content"
                        name="content"
                        onChange={(e) => this.setState({ content: e.target.value })}
                        rows={8}
                        value={content}
                    />
                    <Autocomplete
                        label="Location"
                        placeholder={ "Search for a country"}
                        onInputChange={this.handleLocationSearch}
                        onSelectionChange={(key) => {
                            const location = this.state.locationOptions.find(l => l.id === Number(key));
                            this.setState({ selectedLocation: location || null });
                        }}
                    >
                        {this.filteredLocations().map(location => (
                            <AutocompleteItem
                                key={location.id}
                                textValue={location.name}
                            >
                                <div className="flex items-center gap-2">
                                    <span>{location.name}</span>
                                </div>
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>

                    {selectedLocation && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm">Selected:</span>
                            <Chip>{selectedLocation.name}</Chip>
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="block">Travel Dates (optional)</label>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="date"
                                label="Start Date"
                                value={startDate?.toISOString().split('T')[0] || ''}
                                onChange={(e) => this.setState({
                                    startDate: e.target.value ? new Date(e.target.value) : null
                                })}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <Input
                                type="date"
                                label="End Date"
                                value={endDate?.toISOString().split('T')[0] || ''}
                                onChange={(e) => this.setState({
                                    endDate: e.target.value ? new Date(e.target.value) : null
                                })}
                                min={startDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block">Preferences (select up to 5)</label>
                        <div className="flex flex-wrap gap-2">
                            {PREFERENCE_TAGS.map(tag => (
                                <Chip
                                    key={tag}
                                    onClick={() => this.handleTagToggle(tag)}
                                    color={selectedTags.includes(tag) ? "primary" : "default"}
                                    className="cursor-pointer"
                                >
                                    {tag}
                                </Chip>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        color="primary"
                        className="w-full mt-4"
                        disabled={!title || !content || !selectedLocation}
                    >
                        Create Post
                    </Button>
                </Form>
            </div>
        );
    }
}
