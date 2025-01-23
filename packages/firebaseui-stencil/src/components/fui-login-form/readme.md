# fui-login-form



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description | Type                                               | Default     |
| ----------- | ------------ | ----------- | -------------------------------------------------- | ----------- |
| `config`    | --           |             | `ObservableMap<FUIConfig>`                         | `undefined` |
| `formFroms` | --           |             | `{ [key: string]: any; }`                          | `undefined` |
| `loginType` | `login-type` |             | `"anonymous" \| "email" \| "emailLink" \| "phone"` | `'email'`   |


## Methods

### `submit() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [fui-email-form](../fui-email-form)
- [fui-phone-form](../fui-phone-form)
- [fui-email-link-form](../fui-email-link-form)
- [fui-forgot-password-form](../fui-forgot-password-form)
- [fui-button](../fui-button)

### Graph
```mermaid
graph TD;
  fui-login-form --> fui-email-form
  fui-login-form --> fui-phone-form
  fui-login-form --> fui-email-link-form
  fui-login-form --> fui-forgot-password-form
  fui-login-form --> fui-button
  fui-email-form --> fui-fieldset
  fui-email-form --> fui-input
  fui-phone-form --> fui-fieldset
  fui-phone-form --> fui-input
  fui-email-link-form --> fui-fieldset
  fui-email-link-form --> fui-input
  fui-forgot-password-form --> fui-fieldset
  fui-forgot-password-form --> fui-input
  fui-forgot-password-form --> fui-button
  style fui-login-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
