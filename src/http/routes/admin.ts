import * as express from 'express';
import {wsConCentralSystemRepository, wsConRemoteConsoleRepository} from '../../state-service';

const adminRouter = express.Router();

/**
 * Returns a list of connected systems to the central system and the remote console.
 */
adminRouter.get('/', async (req, res) => {
  const wsConCentralSystemData = wsConCentralSystemRepository.getAll();
  const wsConRemoteConsoleData = wsConRemoteConsoleRepository.getAll();
  const output = JSON.stringify({
    wsConCentralSystemRepository: wsConCentralSystemData.map(e => ({
      conCentralSystem: {
        cpName: e.config.cpName,
        url: e.config.url,
        readyState: e.readyState
      },
      keyStore: e.config.keyStore.get()
    })),
    wsConRemoteConsoleRepository: wsConRemoteConsoleData.map(e => {
      const mappedObj = {};
      mappedObj[e[0].cpName] = e.map(f => ({
        readyState: f.ws.readyState,
        userAgent: f.userAgent,
        remoteHost: f.remoteHost
      }))
      return mappedObj;
    })
  });
  res.send(output);
});

export {
  adminRouter
};
