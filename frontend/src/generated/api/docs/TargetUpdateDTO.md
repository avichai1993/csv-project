# TargetUpdateDTO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**latitude** | **number** | Latitude coordinate | [optional] [default to undefined]
**longitude** | **number** | Longitude coordinate | [optional] [default to undefined]
**altitude** | **number** | Altitude in meters | [optional] [default to undefined]
**frequency** | **number** | Frequency (any positive number) | [optional] [default to undefined]
**speed** | **number** | Speed in m/s | [optional] [default to undefined]
**bearing** | **number** | Bearing in degrees | [optional] [default to undefined]
**ip_address** | **string** | IPv4 address | [optional] [default to undefined]

## Example

```typescript
import { TargetUpdateDTO } from './api';

const instance: TargetUpdateDTO = {
    latitude,
    longitude,
    altitude,
    frequency,
    speed,
    bearing,
    ip_address,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
