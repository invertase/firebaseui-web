# fui-forgot-password-form



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description | Type                       | Default     |
| ---------------- | ----------------- | ----------- | -------------------------- | ----------- |
| `config`         | --                |             | `ObservableMap<FUIConfig>` | `undefined` |
| `email`          | `email`           |             | `string`                   | `''`        |
| `error`          | `error`           |             | `string`                   | `undefined` |
| `successMessage` | `success-message` |             | `string`                   | `undefined` |


## Events

| Event         | Description | Type                  |
| ------------- | ----------- | --------------------- |
| `backToLogin` |             | `CustomEvent<void>`   |
| `emailChange` |             | `CustomEvent<string>` |
| `submitReset` |             | `CustomEvent<void>`   |


## Dependencies

### Used by

 - [fui-login-form](../fui-login-form)

### Depends on

- [fui-fieldset](../fui-fieldset)
- [fui-input](../fui-input)
- [fui-button](../fui-button)

### Graph
```mermaid
graph TD;
  fui-forgot-password-form --> fui-fieldset
  fui-forgot-password-form --> fui-input
  fui-forgot-password-form --> fui-button
  fui-login-form --> fui-forgot-password-form
  style fui-forgot-password-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
