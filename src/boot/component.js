import { defineBoot } from '#q-app/wrappers';
import insightCard from 'src/components/uiComponents/insightCard.vue';
export default defineBoot(({ app }) => {
  app.component('insightCard', insightCard);
});
