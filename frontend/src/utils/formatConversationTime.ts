import moment from "moment";

export const formatConversationTime = (timestamp: string) => {
    const now = moment();
    const messageTime = moment(timestamp);
    if (messageTime.isSame(now, 'minute')) {
      return 'Just now';
    }
    if (now.diff(messageTime, 'minutes') < 60) {
      return `${now.diff(messageTime, 'minutes')} minutes ago`;
    }
    if (now.diff(messageTime, 'hours') < 24) {
      return `${now.diff(messageTime, 'hours')} hour${now.diff(messageTime, 'hours') === 1 ? '' : 's'} ago`;
    }
    if (now.diff(messageTime, 'days') < 7) {
      return `${now.diff(messageTime, 'days')} day${now.diff(messageTime, 'days') === 1 ? '' : 's'} ago`;
    }
    if (now.diff(messageTime, 'weeks') < 52) {
      return `${now.diff(messageTime, 'weeks')} week${now.diff(messageTime, 'weeks') === 1 ? '' : 's'} ago`;
    }
    return `${now.diff(messageTime, 'years')} year${now.diff(messageTime, 'years') === 1 ? '' : 's'} ago`;
  };