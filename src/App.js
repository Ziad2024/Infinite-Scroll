import { QueryClient, QueryClientProvider } from "react-query";
import InfiniteScroll from "./InfiniteScroll/Infinite";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <InfiniteScroll />
    </QueryClientProvider>
  );
}

export default App;
