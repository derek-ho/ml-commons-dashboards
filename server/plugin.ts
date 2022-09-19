import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import createTrainCluster from './clusters/create_train_cluster';
import createModelCluster from './clusters/create_model_cluster';
import createTaskCluster from './clusters/create_task_cluster';
import createPredictCluster from './clusters/create_predict_cluster';
import { MlCommonsPluginSetup, MlCommonsPluginStart } from './types';
import {
  modelRouter,
  taskRouter,
  trainRouter,
  modelAlgorithmRouter,
  predictRouter,
} from './routes';
import { ModelService, TrainService } from './services';
import { TaskService } from './services/task_service';
import { ModelAlgorithmService } from './services/model_algorithm_service';
import { PredictService } from './services/predict_service';

export class MlCommonsPlugin implements Plugin<MlCommonsPluginSetup, MlCommonsPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('mlCommons: Setup');
    const router = core.http.createRouter();

    const trainOSClient = createTrainCluster(core);
    const modelOSClient = createModelCluster(core);
    const taskOSClient = createTaskCluster(core);
    const predictOSClient = createPredictCluster(core);

    const trainService = new TrainService(trainOSClient);
    const modelService = new ModelService(modelOSClient);
    const taskService = new TaskService(taskOSClient);
    const modelAlgorithmService = new ModelAlgorithmService(modelOSClient);
    const predictService = new PredictService(predictOSClient);

    const services = {
      trainService,
      modelService,
      taskService,
      modelAlgorithmService,
      predictService,
    };

    modelRouter(services, router);
    taskRouter(services, router);
    trainRouter(services, router);
    modelAlgorithmRouter(services, router);
    predictRouter(services, router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('mlCommons: Started');
    return {};
  }

  public stop() {}
}