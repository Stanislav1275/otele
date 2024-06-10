import {CurrentRootProvider} from "@/app/routing/routing.tsx";
import {Providers} from "@/app/providers/Providers.tsx";

function App() {

    return (
        <Providers>
            <CurrentRootProvider/>
        </Providers>
    )
}

export default App
