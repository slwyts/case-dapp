# DAPP鉴权

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /common/auth/api/token:
    post:
      summary: DAPP鉴权
      deprecated: false
      description: ''
      tags:
        - chain
      parameters: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                  title: 用户名
                password:
                  type: string
                  title: 密码
                clientName:
                  type: string
                  title: 客户端
              required:
                - username
                - password
                - clientName
              x-apifox-orders:
                - username
                - password
                - clientName
            example:
              username: dapp
              password: xxxx
              clientName: DAPP客户端
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: chain
      x-apifox-status: developing
      x-run-in-apifox: https://app.apifox.com/web/project/4863427/apis/api-413949000-run
components:
  schemas: {}
  securitySchemes: {}
servers: []
security: []

```

# 绑定EVM地址

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /common/digital/asset/bind/address:
    post:
      summary: 绑定EVM地址
      deprecated: false
      description: ''
      tags:
        - chain
      parameters:
        - name: accessToken
          in: header
          description: ''
          example: >-
            Bearer
            eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyQ29udGV4dCI6IntcInVzZXJuYW1lXCI6XCJkYXBwXCIsXCJpZFwiOlwiZXh0X2NsaWVudF8wMDFcIixcImxvbmdUZXJtXCI6ZmFsc2UsXCJyb2xlXCI6XCJBUElcIixcInBlcm1pc3Npb25zXCI6XCJQT1NUOi9jb21tb24vZGlnaXRhbC9hc3NldC9iaW5kL2FkZHJlc3MsR0VUOi9jb21tb24vZGlnaXRhbC9hc3NldC9iaW5kL2NvZGUvKixHRVQ6L2NvbW1vbi9kaWdpdGFsL2Fzc2V0L2Fzc2V0cy8qLFBPU1Q6L2NvbW1vbi9kaWdpdGFsL2Fzc2V0L2Fzc2V0cy9xdWVyeVwifSIsInN1YiI6ImRhcHAiLCJleHAiOjE3NzAwMTYzMjF9.xoIH0gm1CWjBXFgQFKytyAXjPLLGtFNxbYynU6Muz3E
          schema:
            type: string
            default: >-
              Bearer
              eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyQ29udGV4dCI6IntcInVzZXJuYW1lXCI6XCJkYXBwXCIsXCJpZFwiOlwiZXh0X2NsaWVudF8wMDFcIixcImxvbmdUZXJtXCI6ZmFsc2UsXCJyb2xlXCI6XCJBUElcIixcInBlcm1pc3Npb25zXCI6XCJQT1NUOi9jb21tb24vZGlnaXRhbC9hc3NldC9iaW5kL2FkZHJlc3MsR0VUOi9jb21tb24vZGlnaXRhbC9hc3NldC9iaW5kL2NvZGUvKixHRVQ6L2NvbW1vbi9kaWdpdGFsL2Fzc2V0L2Fzc2V0cy8qLFBPU1Q6L2NvbW1vbi9kaWdpdGFsL2Fzc2V0L2Fzc2V0cy9xdWVyeVwifSIsInN1YiI6ImRhcHAiLCJleHAiOjE3NzAwMTYzMjF9.xoIH0gm1CWjBXFgQFKytyAXjPLLGtFNxbYynU6Muz3E
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                userId:
                  type: string
                  x-apifox-mock: 用户ID
                evmAddress:
                  type: string
                  x-apifox-mock: EVM地址
                timestamp:
                  type: integer
                  x-apifox-mock: '{{$date.millisecondsTimestamp}}'
              required:
                - userId
                - evmAddress
                - timestamp
              x-apifox-orders:
                - userId
                - evmAddress
                - timestamp
            example:
              userId: '1376417684140326912'
              evmAddress: '0x4BB53a8EB6034BF3adF47a094bb0229D6E32Bde7'
              timestamp: 1769704179869
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  message:
                    type: string
                  code:
                    type: integer
                  timestamp:
                    type: integer
                  result:
                    type: boolean
                required:
                  - success
                  - message
                  - code
                  - timestamp
                  - result
                x-apifox-orders:
                  - success
                  - message
                  - code
                  - timestamp
                  - result
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: chain
      x-apifox-status: developing
      x-run-in-apifox: https://app.apifox.com/web/project/4863427/apis/api-413950582-run
components:
  schemas: {}
  securitySchemes: {}
servers: []
security: []

```

# 查询用户数字资产

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /common/digital/asset/assets/query/page:
    post:
      summary: 查询用户数字资产
      deprecated: false
      description: ''
      tags:
        - chain
      parameters:
        - name: accessToken
          in: header
          description: ''
          example: >-
            Bearer
            eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyQ29udGV4dCI6IntcInVzZXJuYW1lXCI6XCJkYXBwXCIsXCJpZFwiOlwiZXh0X2NsaWVudF8wMDFcIixcImxvbmdUZXJtXCI6ZmFsc2UsXCJyb2xlXCI6XCJBUElcIixcInBlcm1pc3Npb25zXCI6XCJQT1NUOi9jb21tb24vZGlnaXRhbC9hc3NldC9iaW5kL2FkZHJlc3MsR0VUOi9jb21tb24vZGlnaXRhbC9hc3NldC9iaW5kL2NvZGUvKixHRVQ6L2NvbW1vbi9kaWdpdGFsL2Fzc2V0L2Fzc2V0cy8qLFBPU1Q6L2NvbW1vbi9kaWdpdGFsL2Fzc2V0L2Fzc2V0cy9xdWVyeVwifSIsInN1YiI6ImRhcHAiLCJleHAiOjE3NzAwMTYzMjF9.xoIH0gm1CWjBXFgQFKytyAXjPLLGtFNxbYynU6Muz3E
          schema:
            type: string
            default: >-
              Bearer
              eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyQ29udGV4dCI6IntcInVzZXJuYW1lXCI6XCJkYXBwXCIsXCJpZFwiOlwiZXh0X2NsaWVudF8wMDFcIixcImxvbmdUZXJtXCI6ZmFsc2UsXCJyb2xlXCI6XCJBUElcIixcInBlcm1pc3Npb25zXCI6XCJQT1NUOi9jb21tb24vZGlnaXRhbC9hc3NldC9iaW5kL2FkZHJlc3MsR0VUOi9jb21tb24vZGlnaXRhbC9hc3NldC9iaW5kL2NvZGUvKixHRVQ6L2NvbW1vbi9kaWdpdGFsL2Fzc2V0L2Fzc2V0cy8qLFBPU1Q6L2NvbW1vbi9kaWdpdGFsL2Fzc2V0L2Fzc2V0cy9xdWVyeVwifSIsInN1YiI6ImRhcHAiLCJleHAiOjE3NzAwMTYzMjF9.xoIH0gm1CWjBXFgQFKytyAXjPLLGtFNxbYynU6Muz3E
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                userId:
                  type: string
                  title: 用户ID
                evmAddress:
                  type: string
                  title: EVM地址
                pageNumber:
                  type: integer
                pageSize:
                  type: integer
              required:
                - userId
                - evmAddress
                - pageNumber
                - pageSize
              x-apifox-orders:
                - userId
                - evmAddress
                - pageNumber
                - pageSize
            example:
              userId: '1376417684140326912'
              evmAddress: '0x4BB53a8EB6034BF3adF47a094bb0229D6E32Bde7'
              pageNumber: 1
              pageSize: 10
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: chain
      x-apifox-status: developing
      x-run-in-apifox: https://app.apifox.com/web/project/4863427/apis/api-413953349-run
components:
  schemas: {}
  securitySchemes: {}
servers: []
security: []

```