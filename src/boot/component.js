import { defineBoot } from '#q-app/wrappers';
import insightCard from 'src/components/uiComponents/insightCard.vue';
import listCard from 'src/components/uiComponents/listCard.vue';
export default defineBoot(({ app }) => {
  app.component('insightCard', insightCard);
  app.component('listCard', listCard);
});
