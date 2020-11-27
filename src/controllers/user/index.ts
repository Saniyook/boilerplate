import UserControllerBase from './base';
import GetUser from './getUser';
import { applyControllerMixins } from '../../heplers/applyControllerMixins';

export default applyControllerMixins(UserControllerBase, [GetUser]);
