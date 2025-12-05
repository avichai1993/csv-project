# TargetsApi

All URIs are relative to *http://localhost:5000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createTarget**](#createtarget) | **POST** /api/v1/targets | Create a new target|
|[**deleteTarget**](#deletetarget) | **DELETE** /api/v1/targets/{id} | Delete a target|
|[**getAllTargets**](#getalltargets) | **GET** /api/v1/targets | Get all targets|
|[**getTargetById**](#gettargetbyid) | **GET** /api/v1/targets/{id} | Get a target by ID|
|[**updateTarget**](#updatetarget) | **PUT** /api/v1/targets/{id} | Update a target|

# **createTarget**
> TargetDTO createTarget(targetCreateDTO)

Creates a new target and returns the created object

### Example

```typescript
import {
    TargetsApi,
    Configuration,
    TargetCreateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new TargetsApi(configuration);

let targetCreateDTO: TargetCreateDTO; //

const { status, data } = await apiInstance.createTarget(
    targetCreateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **targetCreateDTO** | **TargetCreateDTO**|  | |


### Return type

**TargetDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Target created successfully |  -  |
|**400** | Validation error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteTarget**
> TargetDTO deleteTarget()

Deletes a target and returns the deleted object

### Example

```typescript
import {
    TargetsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TargetsApi(configuration);

let id: string; //Target UUID (default to undefined)

const { status, data } = await apiInstance.deleteTarget(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Target UUID | defaults to undefined|


### Return type

**TargetDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Target deleted successfully |  -  |
|**404** | Target not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllTargets**
> Array<TargetDTO> getAllTargets()

Returns a list of all targets

### Example

```typescript
import {
    TargetsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TargetsApi(configuration);

const { status, data } = await apiInstance.getAllTargets();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<TargetDTO>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of targets |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTargetById**
> TargetDTO getTargetById()

Returns a single target by its ID

### Example

```typescript
import {
    TargetsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TargetsApi(configuration);

let id: string; //Target UUID (default to undefined)

const { status, data } = await apiInstance.getTargetById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Target UUID | defaults to undefined|


### Return type

**TargetDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Target found |  -  |
|**404** | Target not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTarget**
> TargetDTO updateTarget(targetUpdateDTO)

Updates an existing target and returns the updated object

### Example

```typescript
import {
    TargetsApi,
    Configuration,
    TargetUpdateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new TargetsApi(configuration);

let id: string; //Target UUID (default to undefined)
let targetUpdateDTO: TargetUpdateDTO; //

const { status, data } = await apiInstance.updateTarget(
    id,
    targetUpdateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **targetUpdateDTO** | **TargetUpdateDTO**|  | |
| **id** | [**string**] | Target UUID | defaults to undefined|


### Return type

**TargetDTO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Target updated successfully |  -  |
|**400** | Validation error |  -  |
|**404** | Target not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

