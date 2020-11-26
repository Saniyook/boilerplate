import { api, tags } from '@loopback/openapi-v3';

@api({ basePath: '/users' })
@tags('Users')
export default class UserControllerBase {}
