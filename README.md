# convin-meeting-overview

## Install

```bash
    npm install @convin/meeting-overview antd@^4.6.5 axios@^0.20.0 @ant-design/icons@^4.2.2 prop-types@^15.7.2 react-player@^2.6.2
```

# Styleguide

Find styleguide at [convin-overview](https://convin-overview.netlify.app/)

# Example app

Find example app using meeting overview [convin-example](https://convin-example.netlify.app/)

# Example

```js
    hostname= "https://dev.convin.ai/"
    jwt= "JWT eaDx....",
    callId= 1351
```
```js
    <MeetingOverview
        hostname={hostname} 
        jwt={jwt}   
        callId={callId}
    />
```

## Endpoints being used:

 #### **src > Apis > endpoints.js**

 ```js
 const endpoints = {
    getMeetingId: '/meeting/meeting/retrieve/',
    transcriptEndpoint: '/meeting/meeting/transcript/',
    callMediaEndpoint: '/meeting/meeting/media/',
};

export default endpoints;
```