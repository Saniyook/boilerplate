import UserControllerBase from './base';
import GetUserController from './getUser';
import { applyControllerMixins } from '../../heplers/applyControllerMixins';

export default applyControllerMixins(UserControllerBase, [GetUserController]);
