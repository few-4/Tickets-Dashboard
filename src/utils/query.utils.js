export const buildTicketQuery = ({ status, priority, search }) => {
  const query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;

  // Text Search (utilizes the compound text index from Section 1)
  if (search) {
    query.$text = { $search: search };
  }

  return query;
};

export const buildSortOptions = (sortBy, order) => {
  const sortOptions = {};

  if (sortBy) {
    sortOptions[sortBy] = order === "desc" ? -1 : 1;
  } else {
    sortOptions.createdAt = -1; // Default to newest first
  }

  return sortOptions;
};
