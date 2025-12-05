# ErrorResponseDTO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**error** | **string** | Error message | [default to undefined]
**details** | **{ [key: string]: string; }** | Field-specific error details | [optional] [default to undefined]
**status** | **number** | HTTP status code | [default to undefined]

## Example

```typescript
import { ErrorResponseDTO } from './api';

const instance: ErrorResponseDTO = {
    error,
    details,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
