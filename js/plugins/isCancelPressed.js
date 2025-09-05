/*:
 * @plugindesc 加入右键/取消键输入缓冲，有效增强检测稳定性。
 *
 * @param bufferFrames
 * @text 缓冲持续帧数
 * @type number
 * @min 1
 * @default 5
 *
 * @help
 * 保存为 HoldCancelBuffer.js，放入 js/plugins 并启用。
 * “缓冲持续帧数”默认设为 5 帧（大约 83ms），可调整。
 *
 * 在事件判断中使用：
 *   if ($gameSystem.isCancelBuffered()) { … }
 */

(function() {
  const params = PluginManager.parameters('HoldCancelBuffer');
  const bufferFrames = Number(params['bufferFrames'] || 5);

  const _alias_cancel = TouchInput.isCancelled;
  let bufferTimer = 0;

  function updateBuffer() {
    if (Input.isPressed('cancel') || _alias_cancel.call(TouchInput)) {
      bufferTimer = bufferFrames;
    } else if (bufferTimer > 0) {
      bufferTimer--;
    }
  }

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);
    updateBuffer();
  };

  Game_System.prototype.isCancelBuffered = function() {
    return bufferTimer > 0;
  };
})();
