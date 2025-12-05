# TargetDTO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier (auto-generated) | [default to undefined]
**latitude** | **number** | Latitude coordinate | [default to undefined]
**longitude** | **number** | Longitude coordinate | [default to undefined]
**altitude** | **number** | Altitude in meters | [default to undefined]
**frequency** | **number** | Frequency (any positive number) | [default to undefined]
**speed** | **number** | Speed in m/s | [default to undefined]
**bearing** | **number** | Bearing in degrees | [default to undefined]
**ip_address** | **string** | IPv4 address | [default to undefined]

## Example

```typescript
import { TargetDTO } from './api';

const instance: TargetDTO = {
    id,
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
