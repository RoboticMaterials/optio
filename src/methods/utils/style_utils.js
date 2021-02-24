const colors = [
  "lime",
  "fuchsia",
  "aqua",
  "orange",
  "blanchedalmond",
  "coral",
  "darkcyan",
  "deeppink",
  "gold",
  "lightcyan",
  "lightgreen",
];
let itemCount = 0;

// creates a unique debug style to make it easier to visualize the layout of items
export const getDebugStyle = () => {
  const style = {
    backgroundColor: colors[itemCount],
  };

  itemCount = itemCount + 1;
  return style;
};
