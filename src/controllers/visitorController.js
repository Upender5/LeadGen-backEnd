let interactions = [];

const trackVisitorInteraction = async (req, res) => {
  const { lead_id, event_type, page } = req.body;

  if (!lead_id || !event_type || !page) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const interaction = {
    id: interactions.length + 1,
    lead_id,
    event_type, 
    page,
    timestamp: new Date(),
  };

  interactions.push(interaction);
  return res.status(201).json({ message: 'Interaction tracked successfully.', interaction });
};

const getVisitorInteractions = async (req, res) => {
  const { lead_id } = req.query;

  const filteredInteractions = lead_id
    ? interactions.filter((interaction) => interaction.lead_id === parseInt(lead_id, 10))
    : interactions;

  return res.status(200).json({ interactions: filteredInteractions });
};

module.exports = { trackVisitorInteraction, getVisitorInteractions };
