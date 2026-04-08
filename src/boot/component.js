import { defineBoot } from '#q-app/wrappers';
import globalInsights from 'src/components/globalInsights.vue';
import marketExplorer from 'src/components/marketExplorer.vue';
import insightCard from 'src/components/uiComponents/insightCard.vue';
import listCard from 'src/components/uiComponents/listCard.vue';
import marketTable from 'src/components/marketTable.vue';
import lineChart from 'src/components/uiComponents/lineChart.vue';
export default defineBoot(({ app }) => {
  app.component('globalInsights', globalInsights);
  app.component('marketExplorer', marketExplorer);
  app.component('insightCard', insightCard);
  app.component('listCard', listCard);
  app.component('marketTable', marketTable);
  app.component('lineChart', lineChart);
});
