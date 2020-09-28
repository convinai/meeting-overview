```jsx inside Markdown
const [activeTab, setActiveTab] = React.useState(0);
const handleTabChange = (tabIndex) => setActiveTab(tabIndex);
<CallTabBar
    tabs={[
        'Tab1',
        'Tab2',
        'Tab3',
        'Tab4',
    ]}
    activeTabIndex={activeTab}
    callId={1351}
    handleTabChange={handleTabChange}
    isProcessing={false}
/>
```
