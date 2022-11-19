import type { Component } from "solid-js";
import { onMount, createSignal } from "solid-js";
import "./App.css";

// let results: any[] = [];
const [results, setResults] = createSignal<any[]>([]);
const [loading, setLoading] = createSignal(false);
const [notFound, setNotFound] = createSignal(false);

async function displayEmojis(server: string) {
    setLoading(true);
    try {
        const res = await fetch("https://" + server + "/api/v1/custom_emojis");
        const data = await res.json();
        setResults(data);
        setNotFound(false);
        setLoading(false);
    } catch (e: any) {
        setNotFound(true);
        setLoading(false);
    }
}

function handleForm(e: Event) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const server = target.server.value
        .replace(/https?:\/\//, "")
        .replaceAll("/", "")
        .replaceAll("@", "");
    displayEmojis(server);
}

function Table() {
    return (
        <div class="table">
            {loading() ? (
                <p>Loading...</p>
            ) : notFound() ? (
                <p>Not found</p>
            ) : results().length === 0 ? (
                <p>there's nothing here ¯\_(ツ)_/¯</p>
            ) : (
                <>
                    <p>
                        {results().length} emoji
                        {results().length > 1 ? "s" : ""}
                    </p>
                    <table>
                        <thead>
                            <tr>
                                <th>shortcode</th>
                                <th>image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results().map((emoji: any) => (
                                <tr>
                                    <td>:{emoji.shortcode}:</td>
                                    <td class="emoji">
                                        <img
                                            width="30"
                                            src={emoji.url}
                                            alt={emoji.shortcode}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

const App: Component = () => {
    return (
        <>
            <form onSubmit={handleForm}>
                <input
                    type="text"
                    name="server"
                    required
                    placeholder="example.social"
                />
                <input type="submit" value="search" />
            </form>
            <Table />
        </>
    );
};

export default App;
