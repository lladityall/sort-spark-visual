
import SortingVisualizer from "@/components/SortingVisualizer";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center pb-12">
      <SortingVisualizer />
      
      <footer className="mt-auto pt-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Sorting Visualizer - An Interactive Learning Tool</p>
      </footer>
    </div>
  );
};

export default Index;
