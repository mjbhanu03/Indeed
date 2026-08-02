import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import AppRoutes from "./routes/AppRoutes"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0 * 1000,
    }
  }
})
function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <AppRoutes />
    </QueryClientProvider>
  )
}

export default App
