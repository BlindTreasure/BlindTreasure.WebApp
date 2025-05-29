interface TabWrapperProps {
  tabs: string[];
  currentTab: string;
  onClickTab: (tab: string) => void;
}

export const TabWrapper: React.FC<TabWrapperProps> = ({ tabs, currentTab, onClickTab }) => {
  return (
    <div className="sticky top-0 bg-white z-50 border-b w-full">
      <div className="flex flex-wrap sm:flex-nowrap w-full justify-between">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 min-w-[80px] px-2 py-2 text-sm font-medium border-b-2 transition-all text-center ${
              currentTab === tab
                ? 'text-[#d02a2a] border-[#d02a2a]'
                : 'text-gray-600 border-transparent hover:text-[#d02a2a]'
            }`}
            onClick={() => onClickTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

